from django.urls import path,include
from .views import LeaveEmployee,AdminGetLeaves,AdminLeaveApproval,GetLeaveDetails
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register(r'leave', LeaveEmployee, basename='leave')
router.register(r'all-leaves',AdminGetLeaves,basename='get-leaves')
# router.register(r'leave-details',GetLeaveDetails,basename='leave-details')
router.register(r'update-leave-status',AdminLeaveApproval,basename='update-leaves')

urlpatterns = [
    path('', include(router.urls)),
    path('leave-details/',GetLeaveDetails.as_view(),name='leave-details'),
    path('leave-details/<int:pk>/', GetLeaveDetails.as_view(), name='company-details-update'),
]