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

export interface Counts {
    id: string
    amount: number
    worker_id: string
    worker_code: string
    worker_name: string
    workpoint_id: string
    workpoint_code: string
    workpoint_name: string
    product_id: string
    product_code: string
    product_name: string
    created_at: number
}
