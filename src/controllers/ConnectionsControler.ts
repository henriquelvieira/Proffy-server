import { Request, Response } from 'express';

import db from '../database/connection';


export default class ConnectionsController {
    async index(request: Request, response: Response) {
        
        //Select count na tabela connections
        const totalConnections = await db('connections').count('* as total');

        //Pegar a primeira posição do array retornado
        const { total } = totalConnections[0];

        return response.json({total});

    }

    async create(request: Request, response: Response) {
       
        const trx = await db.transaction();

        try {

            const {user_id} = request.body;

            await trx('connections').insert({user_id});

            await trx.commit();

            return response.status(201).send(); 

        } catch(err){

            //Rollback das operações
            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            });   

        }
    }

}