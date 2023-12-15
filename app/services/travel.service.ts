import {Travel} from "../models/travel.model";

class TravelService{
    private travels: Travel[]

    constructor(){
        this.travels = Travel.generateFakeData()
    }

    getAll(): Travel[] {
        return this.travels
    }

    getOne(id: number): Travel | undefined{
        return this.travels.find(tr => tr.id === id)
    }

    add(travel: Travel){
        this.travels.push(travel)
    }

    update(travelUpdated: Travel) {
        const index = this.travels.findIndex(travel => travel.id === travelUpdated.id)

        if (index < 0) throw 'L\'id ne correspond à aucune offre'

        this.travels[index] = travelUpdated
    }

    delete(id: number){
        this.travels = this.travels.filter(travel => travel.id !== id)
    }
}

export default new TravelService()