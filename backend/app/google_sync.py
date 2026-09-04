import os
from datetime import datetime
from typing import List
from app.config import settings
from app.schemas import OptimizedActionPlan

class GoogleDocSynchronizer:
    def __init__(self):
        self.document_id = settings.GOOGLE_DOC_ID
        self.scopes = ["https://www.googleapis.com/auth/documents"]
        self.creds_path = settings.GOOGLE_CREDS_PATH
        
    def _get_credentials(self):
        if self.creds_path and os.path.exists(self.creds_path):
            try:
                from google.oauth2 import service_account
                return service_account.Credentials.from_service_account_file(
                    self.creds_path, scopes=self.scopes
                )
            except Exception as e:
                print(f"[Google Docs Sync] Credentials parse notice: {e}")
        return None

    def sync_advisory_memo(self, project_name: str, probability: float, category: str, plans: List[OptimizedActionPlan]) -> bool:
        """
        Appends formatted AI Audit advisory blocks directly to the shared team Google Doc.
        Silently succeeds in local mock mode if credentials are unconfigured.
        """
        if not self.document_id or not os.path.exists(self.creds_path):
            # Development/Local mode: simulate sync without error
            print(f"[Google Docs Sync] Local Mode: Simulated sync of advisory memo for '{project_name}'.")
            return False
            
        try:
            from googleapiclient.discovery import build
            creds = self._get_credentials()
            if not creds:
                return False
                
            service = build("docs", "v1", credentials=creds)
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            memo = (
                f"\n\n=========================================\n"
                f"🏛️ DoLR LARR ACT AI ADVISORY LIVE BRIEF: {timestamp}\n"
                f"=========================================\n"
                f"Project Title         : {project_name}\n"
                f"Predicted Delay Risk  : {probability * 100:.1f}%\n"
                f"Risk Classification   : {category}\n\n"
                f"STATUTORY ACTION BLUEPRINTS:\n"
            )
            
            for i, p in enumerate(plans, 1):
                memo += (
                    f"  ({i}) Primary Driver  : {p.trigger_driver} ({p.impact_score})\n"
                    f"      Recommended Act : {p.recommended_action}\n"
                    f"      Statutory Base  : {p.legal_basis}\n"
                    f"      Execution Step  : {p.actionable_blueprint}\n\n"
                )
            memo += "=========================================\n"
            
            requests = [{"insertText": {"endOfSegmentLocation": {}, "text": memo}}]
            service.documents().batchUpdate(documentId=self.document_id, body={"requests": requests}).execute()
            return True
        except Exception as e:
            print(f"[Google Docs Sync] Error syncing: {str(e)}")
            return False

doc_sync = GoogleDocSynchronizer()
