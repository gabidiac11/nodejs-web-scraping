# nodejs-web-scraping
Primarily made for converting whole webpage documations to pdfs by using as input html navigation bar code (from resource/source.xml) where every page href attribute value is extracted, downloaded as html, then converted to pdf (with merging into a single one in the future), into output folder. Also the resource folder should contain a base url and session name (which will be used as subfolder name in output). 

Resource folder contains a style.css which can be injected into resulting html files in order to get rid of elements link footers, headers, etc.