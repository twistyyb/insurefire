import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print(f"Supabase URL: {SUPABASE_URL}")
print(f"Supabase Key: {'*' * 10 + SUPABASE_KEY[-5:] if SUPABASE_KEY else 'Not found'}")

try:
    # Create Supabase client
    supabase: Client = create_client(
        SUPABASE_URL, 
        SUPABASE_KEY
    )
    
    print("Supabase client created successfully")
    
    # Test connection by listing tables
    print("\nTesting connection...")
    
    # Try to get a single row from file_uploads table
    try:
        response = supabase.from_('file_uploads').select('*').limit(1).execute()
        print(f"Connection successful! Response: {response}")
    except Exception as table_error:
        print(f"Error accessing file_uploads table: {str(table_error)}")
        
        # Try listing all tables
        try:
            # This is a raw SQL query to list tables
            response = supabase.table('pg_catalog.pg_tables').select('*').execute()
            print(f"Tables in database: {response}")
        except Exception as list_error:
            print(f"Error listing tables: {str(list_error)}")
    
except Exception as e:
    print(f"Error creating Supabase client: {str(e)}")
