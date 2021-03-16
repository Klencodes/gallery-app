import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authService.userValue;
        const isLoggedIn = user && user.auth_token;
        console.log(isLoggedIn, 'ISLOGGEDIN')
        const isApiUrl = request.url.startsWith(environment.BASE_URL);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Token ${this.authService.userValue.auth_token}`,
                  },                
            });
        }
        console.log(request, 'RESQUEST HEADER')

        return next.handle(request) ;
    }
    
}