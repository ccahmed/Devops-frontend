import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Etudiant {
  idEtudiant: number;
  nomEtudiant: string;
  prenomEtudiant: string;
  cinEtudiant: string;
  dateNaissance: string;
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = 'http://192.168.50.4:8089/tpfoyer/etudiant';

  constructor(private http: HttpClient) {}

  // Retrieve all students
  getEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.baseUrl}/retrieve-all-etudiants`);
  }

  // Delete a student by ID
  deleteEtudiant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-etudiant/${id}`);
  }

  addEtudiant(etudiant: Etudiant): Observable<any> {
    let params = new HttpParams()
      .set('nomEtudiant', etudiant.nomEtudiant)
      .set('prenomEtudiant', etudiant.prenomEtudiant)
      .set('cinEtudiant', etudiant.cinEtudiant)
      .set('dateNaissance', etudiant.dateNaissance)
      .set('profilePicture', etudiant.profilePicture || '');

    return this.http.post(`${this.baseUrl}/add-etudiant`, {}, { params });
  }


  modifyEtudiant(id: number, etudiant: Etudiant): Observable<Etudiant> {
    let params = new HttpParams()
      .set('nomEtudiant', etudiant.nomEtudiant)
      .set('prenomEtudiant', etudiant.prenomEtudiant)
      .set('cinEtudiant', etudiant.cinEtudiant)
      .set('dateNaissance', etudiant.dateNaissance)
      .set('profilePicture', etudiant.profilePicture || '');

    return this.http.put<Etudiant>(`${this.baseUrl}/modify-etudiant/${id}`, {}, { params });
  }
}
