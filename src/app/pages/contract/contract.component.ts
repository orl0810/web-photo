import { Component } from "@angular/core";

@Component({
	templateUrl: './contract.component.html',
	styleUrls: ['./contract.component.scss'],

})
export class ContractComponent {

    clientName: string | undefined = '';
    clientBased: string | undefined = '';
    clientEmail: string | undefined = '';

    sessionType: string = '';
    sessionDate: string = '';
    sessionDuration: string = '';
    rights: boolean = true;
	
    constructor(
	) {
	}

    sendToWhatsApp() {
        const message = `I have read the Photography Services Agreement:

        Name: ${this.clientName}
        From: ${this.clientBased}
        Contact: ${this.clientEmail}
        Session Type: ${this.sessionType}
        Date: ${this.sessionDate}
        Permission to use photos: ${this.rights ? 'YES' : 'NO'}`;
            
        const phoneNumber = '35679552176';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
        window.open(url, '_blank');
        window.location.href = '/gallery';
      }

    onPermissionChange(value: boolean) {
        this.rights = value;
      }
}
