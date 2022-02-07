import { supabase } from "./SupaBase"

const getAny = async (from) => {
    let sel = from == 'people' ? '*' : `*, people(*)` ;
    let {data, error} = await supabase
        .from(from)
        .select(sel)
    return data || error
}

export function AddParticipant() {
    
}

export function AddProof() {

}

export function AddDetective() {

}