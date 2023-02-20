import { Block } from "./block";
import { Employee } from "./employee";
import { Product } from "./product";

export interface Count {
    amount: number;
    employee: Employee;
    product: Product;
    block: Block
}
