Link video 

Link aplicație https://cloudcomputing-seven.vercel.app/

Link GitHub https://github.com/alexandraarhire/cloudcomputing


1.	Introducere
Blogul Culinar este o aplicație web care permite utilizatorilor să își creeze și să își gestioneze rețete culinare.
Această aplicație îi ajută pe utilizatori să adauge rețete noi, să vizualizeze și să șteargă rețetele existente.
Utilizatorii pot căuta rețete după dificultate și pot interacționa cu rețetele prin intermediul unei interfețe intuitive și prietenoase.

2.	Descriere problemă
Blogul Culinar a fost creat pentru a rezolva nevoia de a avea un loc centralizat unde utilizatorii să își poată organiza și împărtăși rețetele preferate.
Uneori, utilizatorii găsesc rețete online sau le inventează pe ale lor, dar le este greu să le gestioneze eficient. Blogul Culinar vine în ajutorul lor, oferindu-le posibilitatea de a salva
și organiza rețetele într-un singur loc.

3.	Descriere API
Blogul Culinar utilizează un API simplu pentru a interacționa cu baza de date și a gestiona operațiunile CRUD pentru rețetele culinare.

Am folosit MongoDB pentru a stoca rețetele introduse prin intermediul interfeței. 
 ![image](https://github.com/alexandraarhire/cloudcomputing/assets/107870741/201838ec-6fb5-4308-850d-ca49db631672)


Interfața este hostată cu ajutorul Vercel.
 ![image](https://github.com/alexandraarhire/cloudcomputing/assets/107870741/eb3ce1e5-1c03-48db-bf96-d163552fc3da)

4.	Flux de date
Exemple de request / response:

![image](https://github.com/alexandraarhire/cloudcomputing/assets/107870741/c1c96796-61ce-4b08-a685-b39edb672b70)

![image](https://github.com/alexandraarhire/cloudcomputing/assets/107870741/0806fef0-1600-46ef-804f-c00eb6f7e560)

Rute API disponibile:

/api/getRecipes: Returnează lista completă de rețete.

/api/createRecipe: Adaugă o rețetă nouă în baza de date.

/api/deleteRecipe: Șterge o rețetă existentă din baza de date.

Metode HTTP:

GET: Pentru a obține lista de rețete sau o rețetă specifică.

POST: Pentru a adăuga o rețetă nouă.

DELETE: Pentru a șterge o rețetă existentă.


5.	Capturi de ecran ale aplicației
![image](https://github.com/alexandraarhire/cloudcomputing/assets/107870741/fd69c498-3b67-496f-82bd-fa4540245c05)

![image](https://github.com/alexandraarhire/cloudcomputing/assets/107870741/1eaea800-57e6-4bd4-9f2c-9950d2742ae8)

![image](https://github.com/alexandraarhire/cloudcomputing/assets/107870741/f2b6947f-127d-48fd-a078-bfecb6744191)

6. Referinte
7. 
https://online.ase.ro/course/view.php?id=40607

https://youtu.be/JIlYroSsInU?si=1jSDrZN9YheiQ9kN



 

 

 


