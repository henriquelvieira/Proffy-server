//Função responsavel pela conversão de Horas em minutos
export default function convertHourToMinutes(time: string){
    
    /*
        * Split do parâmetro pelo caractere (:)  
        * Conversão para Number (Exemplo: 08:00 - Resultado: [8,0]) 
        * Atribuição de cada item do array para uma variável
    */

    const [hour, minutes] = time.split(':').map(Number);

    //Multiplicação da hora por 60 para conversão em minutos
    const timeInMinutes = (hour * 60) + minutes;

    return timeInMinutes;
}