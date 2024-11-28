import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../models/project.model';
import {organisme} from '../models/organisme.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private apiUrl = 'http://localhost:3000'; //attention changer quand vrai api
    constructor(private http: HttpClient) { }

    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects`);

    }



}