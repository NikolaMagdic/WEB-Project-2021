# WEB-Project-2021

Projekat iz predmeta Web programiranje na Fakultetu tehničkih nauka u Novom Sadu - WebShop po ugledu na Donesi i slične servise za dostavu hrane.

## Korišćene tehnologije
- Backend
  - JAX-RS (Jersey implementacija)
  - Apache Tomcat 8
- Frontend
  - jQuery + AJAX
  - HTML i CSS
- Komunikacija između klijenta i servera pomoću JSON objekata prateći REST specifikaciju
- Trajno čuvanje podataka pomoću JSON fajlova
  
 ## Funkcionalnosti
 - Registracija i prijava korisnika na sajt
 - Podržano nekoliko grupa korisnika - administratori, menadžeri, dostavljači i kupci
 - Dodavanje novih menadžera i dostavljača u sistem od strane administratora
 - Dodavanje podataka o restoranu od strane menadžera
 - Pregled podataka o svim restoranima uz mogućnost pretrage i sortiranja rezultata za neregistrovane korisnike
 - Pravljenje porudžbine od strane registrovanih kupaca
 - Vođenje evidencije o statusu porudžbine i njenoj dostavi
 - Ostavljanje komantara za restorane od strane kupaca
 - Dodela bodova redovnim kupcima za obračunavanje popusta
 
 ## Kako pokrenuti projekat
 ### Potrebni alati
 - Razvojno okruženje koje podržava razvoj Java Enterprise aplikacija
 - Tomcat 8 serverski kontejner ili noviji
 - Java 8 verzija ili novija
### Pokretanje projekta
 - Pokrenuti projekat u razvojnom okruženju
 - U internet pretraživaču uneti localhost:8080/WEB-Project-2021
 - Podaci za registraciju prethodno dodatih korisnika radi demonstracije funkcionalnosti:
   - Administator: username: admin, password: admin
   - Menadžer: username: manager, password: 123
   - Dostavljač: username: deliverer, password: 123
   - Kupac: username: user, password: 123


 
