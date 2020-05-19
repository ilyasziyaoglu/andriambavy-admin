import {Component, Input} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {AccessoryService} from '../../../services/accessory.service';
import {ModelAccessoryService} from '../../../services/model-accessory.service';
import {CdkDragEnd} from '@angular/cdk/drag-drop';

@Component({
    selector: 'ngx-desktop',
    templateUrl: './desktop.component.html',
    styleUrls: ['./desktop.component.css']
})
export class DesktopComponent {

    environment = environment;
    JSON = JSON;

    @Input() model: any;
    @Input() accessories: any = [];
    @Input() currentElement: any;

    currentColorModel: any;


    constructor(
        private accessoryService: AccessoryService,
        private propertiesService: ModelAccessoryService
    ) {
    }

    onModelElementSelect() {
        if ( this.currentElement ) {
            this.currentElement.isActive = false;
        }
        this.model.isActive = true;
        this.currentColorModel = this.model;
    }

    onAccessoryElementSelect(accessory: any) {
        if ( this.currentElement ) {
            this.currentElement.isActive = false;
        }
        accessory.isActive = true;
        this.currentElement = accessory;
        this.currentColorModel = accessory;
        this.currentElement.location = this.currentElement.location ? this.currentElement.location : 0;
    }

    onRemoveAccessoryElement(accessory: any) {
        for (let i = 0; i < this.accessories.length; i ++) {
            if ( this.accessories[i] == accessory ) {
                this.accessories.splice(i, 1);
                break;
            }
        }
    }

    onAddNewLocation() {
        const location = {};
        for (let i = 0; i < 10; i ++) {
            location[i] = {
                'disabled': false,
                'rotate': 0,
                'angle': 0,
                'x': 50,
                'y': 50
            };
        }

        const newLocationIndex = Object.keys(this.currentElement.properties.props[this.currentElement.cma]).length;

        this.currentElement.properties.props[this.currentElement.cma][newLocationIndex] = {...location};
        this.currentElement.location = newLocationIndex;
    }

    onSaveProperties() {
        this.propertiesService.saveProperties(this.currentElement.properties);
        this.accessoryService.saveAccessory(this.currentElement);
    }

    ngOnLocationChange(location) {
        this.currentElement.location = location;
    }

    sum(arr: any, key: string) {
        return arr.reduce((a, b) => a + (b[key] || 0), 0);
    }

    onDragEnded(event: CdkDragEnd) {

        const movement = event.source.element.nativeElement.attributes[3].nodeValue.slice(150).split(',').map(s => parseInt(s, 10))

        if ( this.currentElement.isAccessory ) {
            this.currentElement.properties.props[this.currentElement.cma][this.currentElement.location][this.model.angle].x += 100 * (event.distance.x / window.innerWidth);
            this.currentElement.properties.props[this.currentElement.cma][this.currentElement.location][this.model.angle].y += 100 * (event.distance.y / window.innerHeight);
            console.log(this.currentElement.properties.props[this.currentElement.cma][this.currentElement.location][this.model.angle].x);
            console.log(this.currentElement.properties.props[this.currentElement.cma][this.currentElement.location][this.model.angle].y);
        }
    }
}
