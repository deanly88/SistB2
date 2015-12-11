
  function resizeFrame(iframeObj)
  {
  	var innerBody = iframeObj.contentWindow.document.body;
  	var innerWidth = innerBody.scrollWidth + (innerBody.offsetWidth - innerBody.clientWidth);
  	var innerHeight = innerBody.scrollHeight + (innerBody.offsetHeight - innerBody.clientHeight);
  	
  	iframeObj.style.width = innerWidth;
  	iframeObj.style.height = innerHeight;
  	this.scrollTo(1,1);
  }	
