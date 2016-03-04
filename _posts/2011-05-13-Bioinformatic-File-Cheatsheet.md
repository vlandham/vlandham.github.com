---
layout: post
title: Bioinformatic File Cheatsheet
categories:
- bioinfo
---

Some quick notes on common file formats used in the bioinformatic world I am now part of.

GFFv2
-----

Apparently there are 3 different versions of GFF from 2 different sources.
GFFv2 and GFFv3 are the most interesting currently.

### Name

General Feature Format (v1,v2)

### Format

Nine required fields that must be tab-separated.

1.  seqname - The name of the sequence. Must be a chromosome or scaffold.
2.  source - The program or database that generated this feature.
3.  feature - The name of this type of feature. Some examples of standard feature types are “CDS”, “start\_codon”, “stop\_codon”, and “exon”.
4.  start - The starting position of the feature in the sequence. The first base is numbered 1.
5.  end - The ending position of the feature (inclusive).
6.  score - A score between 0 and 1000. If no score, then ‘.’ is used
7.  strand - Valid entries include ‘+’, ‘-’, or ‘.’ (for don’t know/don’t care).
8.  frame - If the feature is a coding exon, frame should be a number between 0-2 that represents the reading frame of the first base. If the feature is not a coding exon, the value should be ‘.’. Field should be called “Phase”
9.  attribute - not-well defined field with tag value ; structure

### Application Support

-   [UCSC Genome Browser](http://genome.ucsc.edu/FAQ/FAQformat.html#format3)

### Source

**GFF v1** & **GFF v2** come from [The Sanger Institute](http://www.sanger.ac.uk/resources/software/gff/)

GFFv3
-----

### Name

Generic Feature Format (v3)

### Format

9 fields separated by tab characters

### Application Support

-   [SnpEff](http://snpeff.sourceforge.net/supportNewGenome.html) - for new genome creation

### Source

**GFF v3** comes from [The Sequence Ontology Project](http://www.sequenceontology.org/gff3.shtml)

### Example

     0  ##gff-version   3
     1  ##sequence-region   ctg123 1 1497228       
     2  ctg123 . gene            1000  9000  .  +  .  ID=gene00001;Name=EDEN

     3  ctg123 . TF_binding_site 1000  1012  .  +  .  ID=tfbs00001;Parent=gene00001

     4  ctg123 . mRNA            1050  9000  .  +  .  ID=mRNA00001;Parent=gene00001;Name=EDEN.1
     5  ctg123 . mRNA            1050  9000  .  +  .  ID=mRNA00002;Parent=gene00001;Name=EDEN.2
     6  ctg123 . mRNA            1300  9000  .  +  .  ID=mRNA00003;Parent=gene00001;Name=EDEN.3

     7  ctg123 . exon            1300  1500  .  +  .  ID=exon00001;Parent=mRNA00003
     8  ctg123 . exon            1050  1500  .  +  .  ID=exon00002;Parent=mRNA00001,mRNA00002
     9  ctg123 . exon            3000  3902  .  +  .  ID=exon00003;Parent=mRNA00001,mRNA00003
    10  ctg123 . exon            5000  5500  .  +  .  ID=exon00004;Parent=mRNA00001,mRNA00002,mRNA00003
    11  ctg123 . exon            7000  9000  .  +  .  ID=exon00005;Parent=mRNA00001,mRNA00002,mRNA00003

BED
---

### Name

BED

### Format

3 initial required fields and 9 additional optional fields. Fields are separated by a tab.

**Required**

1.  **chrom** - name of chromosome
2.  **chromStart** - Starting position in chromosome. First base in chromosome is numbered 0. This 0 based indexing is different from other formats that use a 1 based index.
3.  **chromEnd** - End position of feature in chromosome.

**Optional**

1.  **name** - Name of BED line.
2.  **score** - Score with range of `(0..1000)`. Can denote display indcations
3.  **strand** - ‘+’ or ‘-’
4.  **thickStart** - The starting position at which feature is drawn thickly
5.  **thickEnd** - The ending position at which feature is drawn thickly
6.  **itemRgb** - RGB value example: `255,0,0` which can denote color to display data in BED line. Should limit to 8 colors or less in file.
7.  **blockCount** - Number of exons (blocks) in the BED line
8.  **blockSizes** - comma separated list of block sizes. Number of items in list should be equal to **blockCount**
9.  **blockStarts** - comma separated list of block starts. Values are relative to **chromStart**. Number of items should be equal to **blockCount**

### Application Support

-   [USCS Genome Browser](http://genome.ucsc.edu/FAQ/FAQformat.html)

### Source

USCS?

### Example

    chr1  213941196  213942363
    chr1  213942363  213943530
    chr1  213943530  213944697
    chr2  158364697  158365864

    chr7  127473530  127474697  Pos3  0  +  127473530  127474697  255,0,0
    chr7  127474697  127475864  Pos4  0  +  127474697  127475864  255,0,0
    chr7  127475864  127477031  Neg1  0  -  127475864  127477031  0,0,255

    track name=pairedReads description="Clone Paired Reads" useScore=1
    chr22 1000 5000 cloneA 960 + 1000 5000 0 2 567,488, 0,3512
    chr22 2000 6000 cloneB 900 - 2000 6000 0 2 433,399, 0,3601
