# Firebase Storage Setup & Troubleshooting Guide

## Common 400 Error Causes & Solutions

### 1. Firebase Storage Rules (Most Common)
**Problem**: Default Storage rules block unauthenticated access.

**Solution**: Update Firebase Storage Rules in Firebase Console:
```javascript
// Allow public read access (for music files)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Authenticated write only
    }
  }
}
```

### 2. CORS Configuration
**Problem**: Browser blocks cross-origin requests to Firebase Storage.

**Solution**: Configure CORS for your Storage bucket:
```json
[
  {
    "origin": ["http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

Apply with: `gsutil cors set cors.json gs://your-bucket-name`

### 3. File Path Issues
**Problem**: Incorrect file paths in Firestore documents.

**Check**: Ensure `storagePath` in Firestore matches actual file location:
- ✅ Correct: `music/track1.mp3`
- ❌ Wrong: `/music/track1.mp3` (leading slash)
- ❌ Wrong: `gs://bucket/music/track1.mp3` (full URL)

### 4. Authentication Issues
**Problem**: Storage requires authentication but user isn't signed in.

**Solutions**:
- Use public Storage rules (see #1)
- Or implement Firebase Auth and sign in users
- Or use signed URLs for private files

## Environment Variables Required

Add to `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firestore Document Structure

Each track document in the "tracks" collection should have:
```javascript
{
  id: 1,                           // number
  title: "Song Title",             // string
  duration: "3:42",               // string (MM:SS format)
  format: "MP3",                  // string
  sizeInMB: 8.5,                  // number
  
  // Option 1: Direct download URL (if you have public URLs)
  downloadUrl: "https://firebasestorage.googleapis.com/v0/b/...",
  
  // Option 2: Storage path (will be resolved to download URL)
  storagePath: "music/track1.mp3"  // string (no leading slash)
}
```

## Debugging Steps

1. **Check Console Logs**: Look for detailed error messages in browser console
2. **Verify File Exists**: Check Firebase Console > Storage to confirm files exist
3. **Test Storage Rules**: Try accessing a file URL directly in browser
4. **Check Network Tab**: Look for 400/403 responses and their details
5. **Validate Environment**: Ensure all NEXT_PUBLIC_FIREBASE_* vars are set

## Testing Storage Access

You can test Storage access with this code in browser console:
```javascript
// Test if Firebase is configured
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
});

// Test Storage URL resolution (replace 'your-file-path')
import { storage } from '@/lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

if (storage) {
  getDownloadURL(ref(storage, 'your-file-path'))
    .then(url => console.log('✅ Storage URL:', url))
    .catch(err => console.error('❌ Storage Error:', err));
}
```

## Audio Autoplay Issues

The "play() failed because the user didn't interact" warning is normal browser behavior:
- Browsers block autoplay with sound until user interaction
- Our PreviewPlayer only plays on user click (✅ correct)
- AdvancedMusicalWave starts muted to avoid this issue

If you see autoplay warnings, check that no components call `audio.play()` without user interaction.