from django.shortcuts import render
from .models import Leaves,EmployeeLeaveAssignment
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions,viewsets,status
from .serializers import EmployeeLeaveSerializer,AdminLeaveSerializer,AdminLeaveUpdateSerializer,AssignedLeaveSerializer,LeaveDetailsSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response



#created By Ritesh
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100
class LeaveEmployee(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    pagination_class = CustomPageNumberPagination
    filterset_fields = ['status']
    queryset = Leaves.objects.all()
    serializer_class = EmployeeLeaveSerializer

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            return Leaves.objects.filter(employee_id=self.request.user.id, date__range=[start_date, end_date]).all()
        return Leaves.objects.filter(employee_id=self.request.user.id)


# class AssignedLeave(APIView):
     
#     authentication_classes = [JWTAuthentication]
 
#     def get(self, request, format=None):
#         if request.user.is_superuser:
#             employee_id = request.query_params.get('id', None)
#             if employee_id:
#                 relations = EmployeeLeaveAssignment.objects.filter(employee_id=employee_id)
#             else:
#                 relations = EmployeeLeaveAssignment.objects.all()
#         else:
#             relations = EmployeeLeaveAssignment.objects.filter(employee_id=request.user.id)

#         serializer = AssignedLeaveSerializer(relations, many=True)
#         return Response(serializer.data)


#     def get_permissions(self):
#         if self.request.method in ["POST","PUT","PATCH","DELETE"]:
#             self.permission_classes = [permissions.IsAdminUser]
#         else:
#             self.permission_classes = [permissions.AllowAny]
#         return super().get_permissions()
    
#     def 
    
class GetLeaveDetails(APIView):
    
    authentication_classes = [JWTAuthentication]
    serializer_class = LeaveDetailsSerializer
    def get(self, request, format=None):
        if request.user.is_superuser:
            employee_id = request.query_params.get('id', None)
            if employee_id:
                relations = EmployeeLeaveAssignment.objects.filter(employee_id=employee_id)
            else:
                relations = EmployeeLeaveAssignment.objects.all()
        else:
            relations = EmployeeLeaveAssignment.objects.filter(employee_id=request.user.id)
        print('This is my request',request)
        serializer = LeaveDetailsSerializer(relations, many=True,context={'employeeId': request.query_params.get('id', None) or request.user.id})
        return Response(serializer.data)
    def post(self,request,format=None):
        data = request.data
        serializer = LeaveDetailsSerializer(data, many=True,context={'employeeId': request.query_params.get('id', None) or request.user.id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, pk, format=None):  
            
        user = EmployeeLeaveAssignment.objects.filter(id=pk).first()
        print("user,,,,,,,,,,,,,,,",user)
        serializer = LeaveDetailsSerializer(user,data= request.data,partial=True)
        if serializer.is_valid():
            serializer.save()      
        return Response({"message : Leaves Updated Successfuly"})
    
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions() 




#created By Ritesh
class AdminGetLeaves(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
     
    def get_queryset(self):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        print(start_date,"----------------------------",end_date)
        if start_date and end_date:
            print(start_date,"----------------------------",end_date)
            return Leaves.objects.filter(date__range=[start_date, end_date]).all()
        return Leaves.objects.filter().all()
    serializer_class = AdminLeaveSerializer

#created By Ritesh 
class AdminLeaveApproval(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAdminUser]
    queryset = Leaves.objects.all()
    serializer_class = AdminLeaveUpdateSerializer



          
 

        
    