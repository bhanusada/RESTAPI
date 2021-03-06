import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { SelectionModel } from '@angular/cdk/collections';
import { HeadersList } from './standard-headers';
import * as AppActions from '../../store/app.actions';

export interface Header {
  key: string;
  value: string;
  comments: string;
}

@Component({
  selector: 'app-headers-fav',
  templateUrl: './headers-fav.component.html',
  styleUrls: ['./headers-fav.component.css']
})
export class HeadersFavComponent implements OnInit {

  header_key: string = null;
  header_value: string = null;
  header_comments: string = null;
  filterOptionsForHeaderKey: string[];
  filterOptionsForHeaderValue: string[];
  columns: string[] = ['select', 'key', 'value', 'comments'];
  headersData = new MatTableDataSource<Header>();
  selection = new SelectionModel<Header>(true, []);

  constructor(public dialogRef: MatDialogRef<HeadersFavComponent>, public store: Store<{appStore: any}>) {}

  ngOnInit() {
    this.store.select(state => state.appStore.favHeaders).subscribe(
      headers => {
        this.headersData.data = [];
        headers.map(h => {
          this.headersData.data.push(h);
        });
        this.headersData.data = [...this.headersData.data];
      }
    );
    this.selection.changed.subscribe(
      change => {
        console.log(change);
        console.log(change.source.selected);
        const selectedFavHeaders = {};
        change.source.selected.reverse().forEach(ele => {
          if (selectedFavHeaders[ele.key] !== undefined) {
            this.selection.deselect(ele);
          } else {
            selectedFavHeaders[ele.key] = ele.value;
          }
        })
      }
    )
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.headersData.data.push({
      key: this.header_key,
      value: this.header_value,
      comments: this.header_comments
    });
    this.headersData.data = [...this.headersData.data];
    this.store.dispatch(new AppActions.FavHeaders([{
      key: this.header_key, value: this.header_value, comments: this.header_comments
    }]));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.headersData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.headersData.data.forEach(row => this.selection.select(row));
  }

  onHeadersKey(event) {
    this.filterOptionsForHeaderKey = HeadersList.keys.filter(key => key.toLowerCase().includes(event.target.value));
  }

  onHeadersValue(event) {
    this.filterOptionsForHeaderValue = HeadersList.values.filter(val => val.toLowerCase().includes(event.target.value));
  }

  onSelect(event: Event, idx) {
    //console.log(event);
    //event.stopPropagation();
    // this.selection.isSelected()
    //console.log(this.selection);
    // this.selection.select(...this.headersData.data);
    //console.log(this.selection.selected.length);
    //console.log(this.selection.selected);
    //this.selection.deselect(this.headersData.data[idx]);
  }

}
