Remove-Item -Path ..\backend\public\ -Recurse
Copy-Item -Path public\* -Destination ..\backend\public -PassThru -Recurse
