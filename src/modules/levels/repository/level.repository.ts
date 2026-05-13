import { prisma } from "../../../infrastructure/prisma/client";
export class LevelRepository { list(){return prisma.level.findMany({orderBy:{rank:"asc"}});} create(input:{name:string;rank:number}){return prisma.level.create({data:input});} }
