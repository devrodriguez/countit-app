import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

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

  async getEmployee(code: string): Promise<Employee> {
    const snapshot = this.afs.collection<Employee>('employees', q => 
      q.where('code', '==', code)
    ).snapshotChanges();

    const actions = await firstValueFrom(snapshot);

    if (actions.length === 0) {
      return {} as Employee;
    }

    const a = actions[0];
    const data = a.payload.doc.data() as Employee;
    // const id = a.payload.doc.id;
    return { ...data };
  }
}
