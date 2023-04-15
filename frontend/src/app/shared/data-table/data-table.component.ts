import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableConfig } from 'src/app/models/table-config';
import { UserData } from 'src/app/models/user';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() itemList: any[] = [];
  @Input() config?: TableConfig
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onUpdate(item: any): void {
    this.update.emit(item)
  }
  onDelete(item: any): void {
    this.delete.emit(item)
  }

}
