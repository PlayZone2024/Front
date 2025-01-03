import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserDTO, UserForm, Role, UserRole, UserSalaire } from '../../models/user.dto.model';
import { UserService } from '../../services/user.service';
import { UserCreateUpdateForm } from '../../forms/user.form';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {
    @Input() userData: UserDTO | null = null;
    @Output() formSubmit = new EventEmitter<UserForm>();
    @Output() closeFormRequest = new EventEmitter<void>();

    userForm: FormGroup;
    roles: Role[] = [];
    statusOptions = [
        { label: 'Actif', value: true },
        { label: 'Inactif', value: false },
    ];
    displayHistoryDialog: boolean = false;
    historique: UserSalaire[] = [];

    constructor(private _fb: FormBuilder, private userService: UserService, private _http: HttpClient) {
        this.userForm = this._fb.group({...UserCreateUpdateForm});
    }

    /**
     * On initialise les données du formulaire avec les rôles pour le dropdown
     * Méthode appelée lors de l'initialisation du composant
     * Elle récupère la liste des rôles disponibles via le service utilisateur
     * En cas de succès, elle stocke les rôles dans la propriété 'roles' pour les utiliser dans le formulaire
     * @returns void
    */

    ngOnInit(): void {
        this.userService.getVisibleRoles().subscribe((roles) => {
            this.roles = roles;
        });
    }

    /**
     * Gère les changements des propriétés d'entrée du composant : `userData`.
     * Elle met à jour les champs du formulaire en fonction du mode de modification ou d'ajout.
     * (formulaire dynamique)
     * @param changes - Un objet de type `SimpleChanges` qui contient les valeurs actuelles et précédentes des propriétés d'entrée.
     *                  Il est utilisé pour détecter les changements de la propriété d'entrée `userData`.
     * @returns void
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userData']) { // Sous-entendu : il s'agit du form de modification
            if (this.userData) {
                // Mode modification
                this.userForm.reset({
                    nom: this.userData.nom,
                    prenom: this.userData.prenom,
                    email: this.userData.email,
                    password: null, // On NE préremplit PAS password pour le form de modification (il n'y apparait pas)
                    roles: this.userData.userRoles.map((role: UserRole) => role.roleId), // le map ici permet de transformer les idRole en objets Role
                    isActive: this.userData.isActive
                    // On NE préremplit PAS montant/regime/date : sinon, à chaque modif d'un autre input, il va rajouter un nouveau champ dans l'historique
                });

                // En mode modification, pas de required sur salaire/régime/date.
                // clearValidators() sert à supprimer les règles de validation pour les champs montant, regime, et date
                // updateValueAndValidity() sert à mettre à jour les champs pour prendre en compte les changements de validation
                this.userForm.get('montant')?.clearValidators();
                this.userForm.get('montant')?.updateValueAndValidity();
                this.userForm.get('regime')?.clearValidators();
                this.userForm.get('regime')?.updateValueAndValidity();
                this.userForm.get('date')?.clearValidators();
                this.userForm.get('date')?.updateValueAndValidity();

                this.historique = this.userData.userSalaires; // on récupère les salaires du user
            } else {
                // Mode ajout (car on n'a pas de données d'entrée donc c'est que c'est le form d'ajout)
                this.userForm.reset(); // On réinitialise le formulaire (pas de données préchargées ici)
                // En mode ajout, les champs salaire, régime, date sont requis
                this.userForm.get('montant')?.setValidators([Validators.required]);
                this.userForm.get('regime')?.setValidators([Validators.required]);
                this.userForm.get('date')?.setValidators([Validators.required]);
                this.userForm.get('montant')?.updateValueAndValidity();
                this.userForm.get('regime')?.updateValueAndValidity();
                this.userForm.get('date')?.updateValueAndValidity();
            }
        }
    }

    /**
     * Ouvre la fenêtre d'historique des salaires.
     */
    openHistory() {
        this.historique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // trier l'historique sur la date (décroissant)
        this.displayHistoryDialog = true;
    }

    /**
     * Réinitialise le mot de passe de l'utilisateur.
     * Elle appelle le service utilisateur pour réinitialiser le mot de passe de l'utilisateur.
     * @param userId - L'ID de l'utilisateur dont le mot de passe doit être réinitialisé.
     * @returns void
     */
    resetPassword(userId: number): void {
        this.userService.resetUserPassword(userId).subscribe({
            next: (response) => {
                console.log('Le mail de réinitialisation a bien été envoyé', response);
                this.closeFormRequest.emit(); // ferme la pop-up
            },
            error: (error) => {
                const errMsg = error?.error?.errors ?? error.message ?? 'Erreur inconnue';
                console.error('Erreur d\'envoi du mail de réinitialisation', errMsg);
            }
        });
    }

    /**
     * Ferme la fenêtre d'historique des salaires.
     */
    closeHistory() {
        this.displayHistoryDialog = false;
    }


    /**
     * Soumet les données du formulaire utilisateur si le formulaire est valide.
     * Il construit un objet `UserForm` à partir des valeurs du formulaire et l'émet via l'événement `formSubmit`.
     * Si le formulaire est invalide, il marque tous les champs comme touchés pour déclencher les messages de validation.
     *
     * @returns void
     */
    submit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const formValue = this.userForm.value;

        const userForm: UserForm = {
            nom: formValue.nom ?? this.userData?.nom,
            prenom: formValue.prenom ?? this.userData?.prenom,
            email: formValue.email ?? this.userData?.email,
            password: formValue.password,
            roles: formValue.roles ?? this.userData?.userRoles.map(r => r.roleId) ?? [],
            montant: formValue.montant,
            regime: formValue.regime,
            date: formValue.date,
            isActive: formValue.isActive,
        };

        console.log('Données du formulaire soumises :', userForm);
        this.formSubmit.emit(userForm); // emit sert à déclencher l'événement `formSubmit` et transmettre les données du formulaire au parent
    }
}
