import firebird from 'node-firebird';

const dbOptions : firebird.Options = {
    host : 'localhost',
    port : 3050,
    database : 'C:\\BD\\DATABASE.FDB',
    user : 'SYSDBA',
    password : 'masterkey',
    lowercase_keys : false, // set to true to lowercase keys // default
    pageSize : 4096, // default when creating database
    retryConnectionInterval : 1000, // reconnect interval in case of connection drop
    blobAsText : false, // set to true to get blob as text, only affects blob subtype 1
    encoding : 'UTF8',
};
// Para usar um parametro que recebe uma função 
function executeQuery(query : string, params : string[], cb : (err : Error | null, result ?: Array<any> )=>void){

    firebird.attach(dbOptions, function (err, db) {
        if(err){
            return cb(err);
        }
        
        db.query(query, params, function(erro, result){
            db.detach();

            if(erro){
                return cb(erro);
            } else {
                return cb(null, result);
            }

        })
    })
}

async function executeTransecctions(transaction : firebird.Transaction | undefined, ssql : string, params : string[]) : Promise<any>{
    return new Promise ( (resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
        transaction?.query(ssql, params, function(err, result){
            if(err){
                return reject(err)
            } else {
                return resolve(result)
            }
        } )
    } )

}
export {executeQuery, firebird, dbOptions, executeTransecctions};