import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/gloabal.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);