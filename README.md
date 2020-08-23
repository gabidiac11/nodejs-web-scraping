﻿# nodejs-web-scraping
Primarily made for converting whole webpage documations to pdfs by using as input html navigation bar code (copied to the resource/source.xml), where every page href attribute value is extracted, downloaded as html, then converted to pdf (with merging into a single one in the future), placed into the output folder. The resource folder should contain a constants.xml where needs to be the base url and a session name (which will be used as subfolder name in output). 

Resource folder contains a style.css which can be injected into resulting html files in order to get rid of elements like footers, headers, etc.
