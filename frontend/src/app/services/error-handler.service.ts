import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private toastr: ToastrService,
  ) { }

  handleError(errorRes: HttpErrorResponse, process: string) {
    let errorsObject = errorRes.error.errors;
    if(errorsObject){
      let errorMessage = "Some problem occurs:";
      for (const key in errorsObject) {
        if (Object.prototype.hasOwnProperty.call(errorsObject, key)) {
          errorMessage  += ` ${errorsObject[key]}`;
        }
      }
      this.toastr.error(`${errorMessage}`, `Error during ${process}!`);
    } else if (errorRes.error.message) {
      this.toastr.error(`${errorRes.error.message}`, `Error during ${process}!`);
    } else {
      this.toastr.error(`An unknown error occurred.`, `Error during ${process}!`);
    }
    return throwError(errorRes)
  }


}
