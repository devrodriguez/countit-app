import { Block } from "./block";
import { Employee } from "./employee";
import { Product } from "./product";

export interface Count {
    amount: number;
    block: Block
    count_date: string;
    employee: Employee;
    product: Product;
}
