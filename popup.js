/**
 * Constructs a "videoUrlParts" struct from a standard youtube url
 *
 * @param {string} url - A youtube url
 * 
 * @return {videoUrlParts} a struct containing video identifiers
 *
 */
function parseYtUrl(url){
    var isYoutubeRegex = new RegExp("^(https?://([w]{3}\\.)?youtube\\.com/).+");
    var isPlaylistUrlExp = new RegExp("/playlist\\?list=");
    var isVideoUrlRegex = new RegExp("/watch\\?v=");


    var hasPlaylistPartExp = new RegExp("list=");
    var isVideoRegex = new RegExp("watch\\?v=");
    
    var hasPositionPartExp  = new RegExp(".+[\\?&]index=.+");
    
    
    var videoPartExp = new RegExp(".+watch\\?v=([A-Za-z0-9-_]+)(&.+)?");
    var playlistPartExp = new RegExp(".+[\\?&]list=([A-Za-z0-9_-]+)(&.+)?");
    var plsPosExp = new RegExp(".+[\\?&]index=([A-Za-z0-9-_]+)(&.+)?");
    
    var videoUrlParts = {
                          isVideoUrl : false,
                          isPlaylistUrl : false,
                          hasPosition : false,
                          youtubePart : "no",
                          videoId : "no", 
                          playlistId : "no", 
                          playlistPos : "no",
    };

    // If url isn't on youtube, just quit.
    if (isYoutubeRegex.test(url)) {
      //renderStatus("url is youtube");
      videoUrlParts.youtubePart = url.replace(isYoutubeRegex, "$1");
    } else {
      return; 
    }
    
    // check to see if we've got a playlist or a video
    // if we don't have either, just quit.
    if (isPlaylistUrlExp.test(url)){
      //renderStatus("url is for a video");  
      videoUrlParts.isPlaylistUrl = true;
    } else if (isVideoUrlRegex.test(url)){
      //renderStatus("url is for a playlist");
      videoUrlParts.isVideoUrl = true;
    } else {
      return;
    }
    
    // if we're working with a video url
    // ex: https://www.youtube.com/watch?v=RBgeCCW5Hjs
    if (videoUrlParts.isVideoUrl){
      videoUrlParts.videoId = url.replace(videoPartExp, "$1");
      
      // if it's a part of a playlist
      // ex: https://www.youtube.com/watch?v=RBgeCCW5Hjs&list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq
      if (hasPlaylistPartExp.test(url)){
        videoUrlParts.playlistId = url.replace(playlistPartExp, "$1");
        
        // if it has a playlist position indicated
        // i belive it's malformed to not have a position, not sure though
        // ex: https://www.youtube.com/watch?v=RBgeCCW5Hjs&list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq&index=4
        if (hasPositionPartExp.test(url)) {
          videoUrlParts.playlistPos = url.replace(plsPosExp, "$1");
          videoUrlParts.hasPosition = true;
        }
      }
    }
    // video urls should end up with form
    // isVideo
    // https://www.youtube.com/embed/RBgeCCW5Hjs
    // isVideo && hasPlaylistPart
    // https://www.youtube.com/embed/NpC39uS4K4o?list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq
    // isVideo && hasPlaylistPart && hasPositionPart
    // https://www.youtube.com/embed/bWvyJ05TdC8?index=22&list=PLaDrN74SfdT6duuVl_8qxJ5eaaPHRX_ij

    

    // if we're working with a playlist url
    // easier than working with a video url
    // ex: https://www.youtube.com/playlist?list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq
    if (videoUrlParts.isPlaylistUrl){
      videoUrlParts.playlistId = url.replace(playlistPartExp, "$1");
    }
    // playlist urls should end up with form
    // https://www.youtube.com/embed/videoseries?list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq
    
    return videoUrlParts;
}

/**
 * Constructs an embed url from a "videoUrlParts" object
 *
 * @param {videUrlParts} videoUrlParts - The struct output from
 *   parseYtUrl
 * 
 * @return {string} the embed link constructed from videoUrlParts
 */
function createEmbedUrl(videoUrlParts){
    var finalUrl = videoUrlParts.youtubePart + "embed/";
    if (videoUrlParts.isPlaylistUrl){
      finalUrl += "videoseries?list=" + videoUrlParts.playlistId;
    } else if (videoUrlParts.isVideoUrl){
      finalUrl += videoUrlParts.videoId;
      if (videoUrlParts.playlistId != "no"){
        if (videoUrlParts.hasPosition){
          finalUrl += "?index=" + videoUrlParts.playlistPos + "&";
        } else {
         finalUrl += "?";
        }
        finalUrl += "list=" + videoUrlParts.playlistId;
      }
    }
    return finalUrl;
}

/**
 * Translates a regular YouTube url into the embed version 
 *
 * @param {string} url - the url of the current tab
 * 
 * @return the translated url if successful, null otherwise
 */
function GetEmbedLink(url){
    var videoUrlParts = parseYtUrl(url);
    if (null === videoUrlParts){
      return null;
    }
    var finalUrl = createEmbedUrl(videoUrlParts);
    return finalUrl;
}

/*
  function checkUrl(expected, actual){
      renderStatus(actual);
      if (actual != expected)
      {
        renderStatus("Mismatch! Expected:\n" + expected);
      }
      else 
      {
        renderStatus("Matched!");  
      }
  }

  function testProc(url, id){
    var url3 = "https://www.youtube.com/watch?v=RBgeCCW5Hjs&list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq";
    var chk3 = "https://www.youtube.com/embed/RBgeCCW5Hjs?list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq";
    
    var url4 = "https://www.youtube.com/watch?v=RBgeCCW5Hjs";
    var chk4 = "https://www.youtube.com/embed/RBgeCCW5Hjs";
    
    var url5 = "https://www.youtube.com/playlist?list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq";
    var chk5 = "https://www.youtube.com/embed/videoseries?list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq";
    
    var url6 = "https://www.youtube.com/watch?v=NpC39uS4K4o&index=2&list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq";
    var chk6 = "https://www.youtube.com/embed/NpC39uS4K4o?list=PL5PHm2jkkXmi5CxxI7b3JCL1TWybTDtKq";
    
    var urls = [
      url3,
      url4,
      url5
    ];
    
    var chks = [
      chk3,
      chk4,
      chk5
    ];
    
    for (var x = 0; x < urls.length; x++){
      var link = GetEmbedLink(urls[x]);
      checkUrl(chks[x], link);
    }
}*/

/**
 * Callback assed to chrome.browserAction.onClicked.addListener()
 *
 * @param {chrome.tabs.Tab} tab - the active tab
 * 
 */
function GoToEmbedTab(tab){
    var url = tab.url;
    var id = tab.id;
    var embedurl = GetEmbedLink(url);
    if (null === embedurl){
      chrome.tabs.update(id, {url : url});
    } else {
      chrome.tabs.update(id, {url : embedurl});
    }
}

chrome.browserAction.onClicked.addListener(GoToEmbedTab);
