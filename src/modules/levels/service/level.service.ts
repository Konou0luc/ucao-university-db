import { LevelRepository } from "../repository/level.repository";
export class LevelService { constructor(private readonly repository: LevelRepository) {} list(){return this.repository.list();} create(input:{name:string;rank:number}){return this.repository.create(input);} }
