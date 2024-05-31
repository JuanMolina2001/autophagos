import React from 'react'

const GenemarkOptions = () => {
    return (
        <div>
            <details>
                <summary className='cursor-pointer'>
                    Options
                </summary>
                <div className='overflow-y-auto max-h-36'>
                    <div>
                        <h1>Sequence type</h1>

                        <div>
                            <input type="radio" name="mode" value="auto" checked /> Prokaryotic
                        </div>
                        <div>
                            <input type="radio" name="mode" value="bacteria" /> Bacteria
                        </div>
                        <div>
                            <input type="radio" name="mode" value="archaea" /> Archaea
                        </div>
                    </div>

                    <div>
                        <h1> Output format for gene prediction </h1>

                        <div>
                            <input type="radio" name="format" value="lst" checked /> LST
                        </div>
                        <div>
                            <input type="radio" name="format" value="gff3" /> GFF3
                        </div>
                        <div>
                            <input type="radio" name="format" value="gtf" /> GTF
                        </div>
                    </div>

                    <div>
                        <h1> Output options </h1>
                        <div><input type="checkbox" name="faa" value="faa" /> Protein sequence</div>
                        <div><input type="checkbox" name="fnn" value="fnn" /> Gene nucleotide sequence</div>

                    </div>

                    <div className='flex flex-col gap-2'>
                        <h1>
                            Optional: results
                            by E-mail
                        </h1>
                        <div  className='flex gap-2'>
                            E-mail
                            <input type="text" className='bg-transparent border-white border border-solid' name="email" />
                        </div>
                        <div  className='flex gap-2'>
                            Subject
                            <input className='bg-transparent border-white border border-solid' type="text" name="subject" value="GeneMarkS-2" />
                        </div>
                        <div>
                            <input type="checkbox" name="zip" value="zip" /> Compress files
                        </div>

                    </div>
                </div>




            </details>
            <details>
                <summary className='cursor-pointer'>
                    Advance Options
                </summary>
                <div>
                    <div>
                        <input type="radio" name="gcode" value="11" checked/> Genetic code 11.
                    </div>
                    <div>
                        <input type="radio" name="gcode" value="4" /> Genetic code 4. "TGA" codon as Tryptophan (not a stop codon)
                    </div>
                    <div>
                        <input type="radio" name="gcode" value="25" /> Genetic code 25. "TGA" codon as Glycine (not a stop codon)
                    </div>


                </div>
            </details>
        </div>

    )
}

export default GenemarkOptions