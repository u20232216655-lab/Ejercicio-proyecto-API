import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonCheckbox,
  IonButton,
  IonButtons,
  IonIcon,
  IonBadge,
  IonModal,
  IonImg,
  IonSpinner,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  phonePortraitOutline,
  createOutline,
  documentTextOutline,
  paperPlaneOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { BookingRequest, AVAILABLE_SERVICES, ServiceCategory } from '../models/booking-request.model';
import { FeedbackService } from '../services/feedback.service';
import { ApiService } from '../services/api.service';

interface Producto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonCheckbox,
    IonButton,
    IonButtons,
    IonIcon,
    IonBadge,
    IonModal,
    IonImg,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
  ]
})
export class HomePage {
  private readonly feedbackService = inject(FeedbackService);

  readonly services: ServiceCategory[] = AVAILABLE_SERVICES;

  formData: BookingRequest = {
    fullName: '',
    serviceType: '',
    smsNotifications: true,
    acceptTerms: false
  };

  isTermsModalOpen: boolean = false;

  constructor() {
    addIcons({
      phonePortraitOutline,
      createOutline,
      documentTextOutline,
      paperPlaneOutline,
      closeCircleOutline
    });
  }

  

  setTermsModalOpen(isOpen: boolean): void {
    this.isTermsModalOpen = isOpen;
  }


  async enviarSolicitud(): Promise<void> {
    const trimmedName = this.formData.fullName ? this.formData.fullName.trim() : '';

    if (!trimmedName || !this.formData.serviceType || !this.formData.acceptTerms) {
      await this.feedbackService.showToast(
        'Por favor complete los campos obligatorios (*)',
        'danger',
        3000
      );
      return;
    }

    const selectedService = this.services.find(s => s.id === this.formData.serviceType);
    const serviceName = selectedService ? selectedService.name : this.formData.serviceType;
    const smsStatusText = this.formData.smsNotifications ? 'Habilitadas (Sí)' : 'Deshabilitadas (No)';

    const summaryMessage = `
      <strong>Estudiante:</strong> ${trimmedName}<br>
      <strong>Servicio:</strong> ${serviceName}<br>
      <strong>Notificaciones SMS:</strong> ${smsStatusText}<br>
      <strong>Términos:</strong> Aceptados correctamente.<br><br>
      <em>¡Tu registro ha quedado almacenado en memoria con éxito!</em>
    `;

    await this.feedbackService.showAlert(
      '¡Solicitud Registrada con Éxito!',
      'Universidad Surcolombiana',
      summaryMessage,
      'Aceptar y Finalizar'
    );
  }

  private apiService = inject(ApiService);

  items: Producto[] = [];
  cargando = true;
  error = false;

  ngOnInit() {
    this.apiService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }
}
