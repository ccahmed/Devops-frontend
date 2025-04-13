import { Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EtudiantService, Etudiant } from 'src/app/services/etudiant.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule
import Swal from 'sweetalert2';

@Component({
  selector: 'app-default',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe],
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule]   // Add FormsModule here
})
export class DefaultComponent implements AfterViewInit {
  @ViewChild('studentModal') studentModal!: TemplateRef<any>;
  etudiants: Etudiant[] = [];
  filteredEtudiants: Etudiant[] = [];
  selectedEtudiant: Etudiant | null = null;
  searchQuery: string = '';
  selectedFile: File | null = null;
  addStudentMode = false;

  studentForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private etudiantService: EtudiantService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    // Initialize form with validators
    this.studentForm = this.fb.group({
      nomEtudiant: ['', Validators.required],
      prenomEtudiant: ['', Validators.required],
      cinEtudiant: [
        '',
        [Validators.required, Validators.pattern(/^\d{8}$/)] // Only numbers and exactly 8 digits
      ],
      dateNaissance: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // Ensures the modal is available after view initialization
    console.log(this.studentModal); // This should not be null now
  }

  ngOnInit(): void {
    this.loadEtudiants();
  }

  loadEtudiants(): void {
    this.etudiantService.getEtudiants().subscribe((data: Etudiant[]) => {
      this.etudiants = data;
      this.filteredEtudiants = [...this.etudiants]; // Show full list initially
    });
  }

  filterEtudiants(): void {
    if (this.searchQuery.trim()) {
      this.filteredEtudiants = this.etudiants.filter(etudiant =>
        `${etudiant.nomEtudiant} ${etudiant.prenomEtudiant}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    } else {
      // Show full list when search query is empty
      this.filteredEtudiants = [...this.etudiants];
    }
  }

  // Call filterEtudiants() whenever the search query changes
  onSearchQueryChange(): void {
    this.filterEtudiants();
  }

  openAddStudentModal() {
    this.addStudentMode = true;
    this.resetSelectedEtudiant();
    if (this.studentModal) {
      this.modalService.open(this.studentModal, { ariaLabelledBy: 'modal-basic-title' });
    } else {
      console.error('Modal template is not available.');
    }
  }

  openEditStudentModal(etudiant: Etudiant) {
    this.addStudentMode = false;
    this.selectedEtudiant = { ...etudiant };
    if (this.studentModal) {
      this.modalService.open(this.studentModal, { ariaLabelledBy: 'modal-basic-title' });
    } else {
      console.error('Modal template is not available.');
    }
  }

  resetSelectedEtudiant(): void {
    this.selectedEtudiant = {
      idEtudiant: 0,
      nomEtudiant: '',
      prenomEtudiant: '',
      cinEtudiant: '',
      dateNaissance: '',
      profilePicture: ''
    };
    this.selectedFile = null;
  }

  addEtudiant(): void {
    if (this.studentForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const formData = this.studentForm.value;
    formData.dateNaissance = this.datePipe.transform(formData.dateNaissance, 'yyyy-MM-dd');

    this.etudiantService.addEtudiant(formData).subscribe(
      () => {
        this.loadEtudiants();
        this.resetModal();
        Swal.fire({
          icon: 'success',
          title: 'Student added successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error => {
        console.error("Error adding etudiant:", error);
      }
    );
  }

  updateEtudiant(): void {
    if (!this.selectedEtudiant) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to update this student's information.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff8c00',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = { ...this.selectedEtudiant };
        formData.dateNaissance = this.datePipe.transform(formData.dateNaissance, 'dd/MM/yyyy');

        this.etudiantService.modifyEtudiant(formData.idEtudiant, formData).subscribe(
          () => {
            this.loadEtudiants();
            this.resetModal();
            Swal.fire({
              icon: 'info',
              title: 'Student updated successfully!',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error => {
            console.error("Error updating etudiant:", error);
          }
        );
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  deleteEtudiant(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will permanently delete the student.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.etudiantService.deleteEtudiant(id).subscribe(
          () => {
            this.etudiants = this.etudiants.filter(etudiant => etudiant.idEtudiant !== id);
            Swal.fire({
              icon: 'success',
              title: 'Student deleted successfully!',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error => {
            console.error("Error deleting etudiant:", error);
          }
        );
      }
    });
  }

  resetModal(): void {
    this.resetSelectedEtudiant();
    this.modalService.dismissAll();
  }
}
