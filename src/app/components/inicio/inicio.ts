import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  nombreTienda = 'Tienda J&M';
  logoUrl = '/img/logo-tienda-jm.jpg';
}