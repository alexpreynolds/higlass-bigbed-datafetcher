# higlass-bigbed-datafetcher
Provide remote access to remotely-hosted bigBed files to HiGlass client applications

## Usage

This enables access to a web-hosted bigBed file for use with the `higlass-transcripts` (https://github.com/higlass/higlass-transcripts) plug-in.

Register the data fetcher in your HiGlass application:

```
import register from "higlass-register";
import { BigBedDataFetcher } from "higlass-bigbed-datafetcher";

register (
  { 
    dataFetcher: BigBedDataFetcher, 
    config: BigBedDataFetcher.config,
  },
  { 
    pluginType: "dataFetcher",
  }
);
```

Configure the view configuration's `horizontal-transcripts` object with `data` attributes pointing to the web-hosted tabix file:

```
{
  "name": "My bigBed elements",
  "type": "horizontal-transcripts",
  "uid": "my_bigbed_uid",
  "options": {
    "fontSize": 9, // font size for labels and amino acids (if available)
    "fontFamily": "Helvetica",
    "labelFontColor": "#333333",
    "labelBackgroundPlusStrandColor": "#ffffff",
    "labelBackgroundMinusStrandColor": "#ffffff",
    "labelStrokePlusStrandColor": "#999999",
    "labelStrokeMinusStrandColor": "#999999",
    "plusStrandColor": "#bdbfff", // color of coding parts of the exon on the plus strand
    "minusStrandColor": "#fabec2", // color of coding parts of the exon on the negative strand
    "utrColor": "#C0EAAF", // color of untranslated regions of the exons
    "backgroundColor": "#ffffff", // color of track background
    "transcriptHeight": 12, // height of the transcripts
    "transcriptSpacing": 2, // space in between the transcripts
    "name": "Gene transcripts",
    "maxTexts": 50, // Maximum number of labels shown on the screen
    "showToggleTranscriptsButton": true, // If the "Show fewer transcripts"/"Show more transcripts" is shown
    "trackHeightAdjustment": "automatic", // if "automatic", the height of the track is adjusted to the number of visible transcripts.
    "startCollapsed": false, // if true, only one transcript is shown
  },
  "data" : {
    "type": "bigbed",
    "url": "https://example.com/bigBed/my_elements.bb",
    "chromSizesUrl": "https://example.com/bigBed/hg38.chromSizes.gz",
  },
}
```

The format of data is currently driven by the `formatTranscriptData` function in `higlass-transcripts`, where transcript metadata are stored in thirteen columns:

```
formatTranscriptData(ts) {
  const strand = ts[5];
  const stopCodonPos = ts[12] === "." ? "." : (strand === "+" ? +ts[12] + 2 : +ts[12] - 1);
  const startCodonPos = ts[11] === "." ? "." : (strand === "+" ? +ts[11] - 1 : +ts[11] + 2);
  const exonStarts = ts[9].split(",").map((x) => +x - 1);
  const exonEnds = ts[10].split(",").map((x) => +x);
  const txStart = +ts[1] - 1;
  const txEnd = +ts[2] - 1;

  const result = {
    transcriptId: this.transcriptId(ts),
    transcriptName: ts[3],
    txStart: txStart,
    txEnd: txEnd,
    strand: strand,
    chromName: ts[0],
    codingType: ts[8],
    exonStarts: exonStarts,
    exonEnds: exonEnds,
    startCodonPos: startCodonPos,
    stopCodonPos: stopCodonPos,
    importance: +ts[4],
  };
  return result;
}
```

Placeholders are used to change rendering behavior when fields are missing data.