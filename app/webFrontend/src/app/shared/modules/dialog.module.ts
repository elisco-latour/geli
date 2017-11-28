import {NgModule} from '@angular/core';
import {ConfirmDialog} from '../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../components/access-key-dialog/access-key-dialog.component';
import {FilepickerDialog} from '../components/filepicker-dialog/filepicker-dialog.component';
import {DialogService} from '../services/dialog.service';
import {FormsModule} from '@angular/forms';
import {UploadDialog} from '../components/upload-dialog/upload-dialog.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';
import {MaterialImportModule} from './material-import.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    MaterialImportModule,
  ],
  exports: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
  ],
  declarations: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
  ]
})
export class DialogModule {
}