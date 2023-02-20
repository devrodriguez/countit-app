import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private afs: AngularFirestore) { }

  getEmployees(): AngularFirestoreCollection<Employee> {
    const collEmployees: AngularFirestoreCollection<Employee> = this.afs.collection<Employee>("employees", q => q.orderBy("name"));
    return collEmployees;
  }
}
