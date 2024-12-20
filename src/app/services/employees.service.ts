import { Injectable, OnInit } from '@angular/core';
import { collection, CollectionReference, doc, DocumentData, Firestore, getDoc } from '@angular/fire/firestore';

import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private employeeRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.employeeRef = collection(this.firestore, 'employees')
  }

  async getEmployeeByID(docID: string): Promise<Employee | null> {
    const docRef = doc(this.employeeRef, docID)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as Employee;
    const id = docSnap.id;
    return { ...data, id };
  }
}
