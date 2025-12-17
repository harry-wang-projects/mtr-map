import requests
from typing import Callable, List, Any

def combine_apis(urls: List[str], extractor: Callable[[dict], List[Any]] = None):
    """
    Advanced version with custom extractor function
    
    Args:
        urls: List of API URLs
        extractor: Optional function to extract list from response dict
    """
    results = []
    
    for url in urls:
        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            if extractor:
                extracted = extractor(data)
                if isinstance(extracted, list):
                    results.extend(extracted)
                else:
                    results.append(extracted)
            else:
                # Default extraction logic
                if isinstance(data, list):
                    results.extend(data)
                elif isinstance(data, dict):
                    # Try common patterns
                    for key in ['data', 'results', 'items', 'payload', 'response']:
                        if key in data:
                            if isinstance(data[key], list):
                                results.extend(data[key])
                                break
                            elif isinstance(data[key], dict):
                                results.append(data[key])
                    else:
                        results.append(data)
                        
        except Exception as e:
            print(f"Failed to process {url}: {e}")
    
    return results

# Example with custom extractor
def extract_posts(data):
    return data if isinstance(data, list) else data.get('posts', [])

# Usage
urls = [
    "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=KET", 
    "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=HKU", 
    "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=SYP"
]
all_results = combine_apis(urls)
print(all_results[0].data)