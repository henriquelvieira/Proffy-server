import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinute';

interface  ScheduleItem {
    week_day: number;
    from: string; 
    to: string;
}



export default class ClassesController {
    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject =  filters.subject as string;
        const week_day =  filters.week_day as string;
        const time =  filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinutes(filters.time as string);
        
        const classes = await db('classes')
            .where('classes.subject', '=', subject);

         
        return response.json(classes);

        
    }

    async create(request: Request, response: Response) {
    
        //Definição da Transaction no Banco
        const trx = await db.transaction();
       
        try {
            //Desestrutação dos dados enviados no body da requisição
            const {
                name,
                avatar,
                whatsapp,
                bio, 
                subject,
                cost,
                schedule
            } = request.body;
    
            //Insert na tabela users + Receber array c/ os IDS do usuários que foram criados
            const insertedUserIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
    
            //Pegar o ID do usuário criado (posição 0);
            const user_id = insertedUserIds[0];
    
            //Insert na tabela classes + Receber array c/ os IDS das classes que foram criados
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id
            });
    
            //Pegar o ID da Classes criada (posição 0);
            const class_id = insertedClassesIds[0];
    
            //Percorrer o array do objeto schedule criando um novo array com os campos from e to tendo seus valores convertidos para minutos
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) =>{
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to : convertHourToMinutes(scheduleItem.to),
                };
            });
    
            //Insert na tabela class_schedule com os valores do array classSchedule  
            await trx('class_schedule').insert(classSchedule);
    
            //Commit das operações da transaction
            await trx.commit();
    
            return response.status(201).send();
    
        } catch (err) {
           
            //Rollback das operações
            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            });   
        }
    
    }


}