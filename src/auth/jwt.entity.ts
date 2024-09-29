import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from '../users/user.entity';

@Entity()
export class PersonalAccessTokens{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column({nullable:true})
    token?: string;

    @Column({nullable: true})
    createdAt: Date;

    @Column({nullable: true})
    updatedAt: Date;

    @ManyToOne(()=> UserEntity,userEntity => userEntity.id)
    user : UserEntity 


}