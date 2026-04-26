import sys
import json

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print(json.dumps({"error": "youtube_transcript_api module not found"}))
    sys.exit(1)

def get_transcript(video_id):
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.list(video_id)
        
        # Try finding English first, else pick the first available
        transcript = None
        try:
            transcript = transcript_list.find_transcript(['en', 'en-US', 'en-GB'])
        except:
            for t in transcript_list:
                transcript = t
                break
                
        if not transcript:
            return {"error": "No transcripts found"}
            
        data = transcript.fetch()
        
        segments = []
        for item in data:
            if hasattr(item, "text"):
                segments.append({
                    "text": item.text,
                    "start": item.start,
                    "duration": item.duration
                })
            else:
                segments.append({
                    "text": item.get("text", ""),
                    "start": item.get("start", 0),
                    "duration": item.get("duration", 0)
                })

        return {"data": segments}
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No video ID provided"}))
        sys.exit(1)
        
    result = get_transcript(sys.argv[1])
    print(json.dumps(result))
