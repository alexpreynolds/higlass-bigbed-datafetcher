import { describe, expect, it } from 'vitest';
import BigBedDataFetcher from '../src/BigBedDataFetcher.js';

describe("BigBed data fetcher tests", () => {
  describe("BigBed data fetcher", () => {
    const df = new BigBedDataFetcher(
      {},
      {
        type: "bigbed",
        url: "https://areynolds-us-west-2.s3.us-west-2.amazonaws.com/bigBed/gencode.v38.annotation.gtf.higlass-transcripts.hgnc.090721.forceHGNC.bb",
        chromSizesUrl: "https://areynolds-us-west-2.s3.amazonaws.com/hg38.meuleman.fixedBin.chrom.sizes",
      }
    );

    it("should fetch the tileset info", () => new Promise((done) => {
      df.tilesetInfo((tsInfo) => {
        expect(tsInfo.tile_size).to.eql(1024);
        expect(tsInfo.max_zoom).to.eql(22);
        done();
      });
    }));
  });

  
});
