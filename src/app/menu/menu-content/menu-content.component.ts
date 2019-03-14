import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { APIService } from '../../shared/api.service';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.css']
})
export class MenuContentComponent implements OnInit {
  tabs = [];
  names = [];
  selectedTab = 0;
  activeTabIndex;
  servicemenu;
  position;

  constructor(
    public apiService: APIService,
    public store: Store<{ appStore: any }>
  ) {}

  ngOnInit() {
    this.apiService.names.subscribe((res: any) => (this.names = res));
    this.store
      .select(state => state.appStore.selectedService)
      .subscribe(selected => {
        // Initial state
        if (selected.sysid === 0 && selected.srvid === 0) {
        } else {
          const tabId = selected.sysid + '_' + selected.srvid;
          const tabIdx = this.tabs.findIndex(tab => tab.id === tabId);
          if (tabIdx === -1) {
            this.tabs.push({ id: tabId, name: selected.srvname });
            this.selectedTab = this.tabs.length;
            this.selectedTab++;
          } else {
            this.selectedTab = tabIdx;
          }
        }
      });
  }

  onTabIndexChanged(e) {
    this.activeTabIndex = e;
  }
  onClose(idx) {
    this.tabs.splice(idx, 1);
  }
}
