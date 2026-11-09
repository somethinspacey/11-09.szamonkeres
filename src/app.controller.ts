import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { NewReservationDto } from './newreservation.dto.js';
import fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getReservation() {
    return {
      title: 'Szállásfoglalás',
      message: "",
      errors: []
    }
  }

  @Post()
  @Render('index')
  postReservation(@Body() body: NewReservationDto ) {
    const errors: string[] = []
    if (!body.name) {
      errors.push('A név megadása kötelező!')
    }
    if (!body.email) {
      errors.push('Az email megadása kötelező!')
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(body.email)) {
      errors.push('Az email formátuma nem megfelelő!')
    }
    if (!body.date) {
      errors.push('A dátum megadása kötelező!')
    }
    else if(new Date(body.date) < new Date()) {
      errors.push('A dátum nem lehet a mai napnál korábbi!')
    }
    if (!body.amount) {
      errors.push('A férőhelyek számának megadása kötelező!')
    }
    else if (body.amount < 1 || body.amount > 10) {
      errors.push('A férőhelyek száma 1 és 10 között lehet!')
    }

    if (errors.length > 0) {
      return {
        errors,
        title: 'Foglalás',
        message: "Hibák a bevitelben!",
        body
      }
    }
    else { const jsonfile = (fs.existsSync('reservations.json')? JSON.parse(fs.readFileSync('reservations.json', 'utf8')) : []);
      jsonfile.push({
        name: body.name,
        email: body.email,
        date: body.date,
        amount: body.amount
      });
      fs.writeFileSync('reservations.json', JSON.stringify(jsonfile));
    }
    return {
      title: 'Szállásfoglalás',
      message: "Sikeres foglalás!",
      errors: []
    }
  }
}
