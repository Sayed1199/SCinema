import { PersonalAccessTokens } from "src/auth/jwt.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable:true})
    username: string;

    @Column({nullable:false,unique:true})
    email: string;

    @Column({nullable:false})
    password: string;

    @Column({nullable:true})
    createdAt: Date;
    
    @Column({nullable:true})
    updatedAt: Date;

    @OneToMany(()=> PersonalAccessTokens,pac => pac.user,{})
    tokens : PersonalAccessTokens[] 

} 