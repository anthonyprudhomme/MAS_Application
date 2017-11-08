export class Event {
 
    constructor(public location: any,
        public date: number,
        public name: string,
        public pictureUrl: string,
        public description: string,
        public price: number,
        public bookingUrl: string,
        public id: number,
        public whoIsGoing: string[],
        public address: string,
        public duration: number,
        public typeOfEvent: TypeOfEvent,
        public interestedIn: string[],
        public addressComplement: string,
        public facebookId: number,
        public language: string){
 
    }

    public static doSomething(){
        console.log("doing somehting");
    }
}