describe('controllers', function () {
    var scope, controller, $httpBackend;

    beforeEach(module('myApp'));
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('ContactController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('ContactController', {
                '$scope': scope
            });
        }));

        it('should be defined', inject(function ($controller) {
            expect(controller).toBeDefined();
            expect(scope.save).toBeDefined();
        }));

        it('should hold the user id of the currently logged in user', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(200, {id: 42});

            $httpBackend.flush();

            expect(scope.feedback.UserId).toBe(42);

        }));

        it('should hold no user id if current user is not logged in', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(200, {});

            $httpBackend.flush();

            expect(scope.feedback.UserId).toBeUndefined();

        }));

        it('should hold no user id if retrieving currently logged in user fails', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(500);

            $httpBackend.flush();

            expect(scope.feedback).toBeUndefined();

        }));

        it('should hold the user email of the currently logged in user', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(200, {email: 'x@x.xx'});

            $httpBackend.flush();

            expect(scope.userEmail).toBe('x@x.xx');

        }));

        it('should hold anonymous placeholder for email if current user is not logged in', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(200, {});

            $httpBackend.flush();

            expect(scope.userEmail).toBe('anonymous');

        }));

        it('should hold no user email if retrieving currently logged in user fails', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(500);

            $httpBackend.flush();

            expect(scope.feedback).toBeUndefined();

        }));

        it('should display thank-you message and reset feedback form on saving feedback', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(200, {});

            $httpBackend.whenPOST('/api/Feedbacks/').respond(200, {data: {comment: 'Test', rating: 4}});
            scope.feedback = {comment: 'Test', rating: 4}
            scope.form = {$setPristine: function() {}};

            scope.save();
            $httpBackend.flush();

            expect(scope.feedback).toEqual({});
            expect(scope.confirmation).toBe('Thank you for your feedback.');

        }));

        it('should display 5-star thank-you message and reset feedback form on saving 5-star feedback', inject(function ($controller) {
            $httpBackend.whenGET('/rest/user/whoami').respond(200, {});

            $httpBackend.whenPOST('/api/Feedbacks/').respond(200, {data: {comment: 'Praise', rating: 5}});
            scope.feedback = {comment: 'Praise', rating: 5}
            scope.form = {$setPristine: function() {}};

            scope.save();
            $httpBackend.flush();

            expect(scope.feedback).toEqual({});
            expect(scope.confirmation).toBe('Thank you for your feedback and your 5-star rating!');

        }));

    });

});
