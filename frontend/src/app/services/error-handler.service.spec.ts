import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockErrorResponse: any;

  beforeEach(() => {
    mockToastrService = jasmine.createSpyObj(['error']);

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: ToastrService, useValue: mockToastrService }
      ]
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call toastrService with a valid message', () => {
    mockErrorResponse = {
      error: {
        message: "Test error message"
      }
    }
    const process = 'test'

    service.handleError(mockErrorResponse, process);

    expect(mockToastrService.error).toHaveBeenCalledWith(`${mockErrorResponse.error.message}`, `Error during ${process}!`);
  });

});
