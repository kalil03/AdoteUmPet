const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize } = require('../src/models');
const Pet = require('../src/models/pet')(sequelize);

async function seedPets() {
  try {
    console.log('🌱 Iniciando processo de seed...');
    //conectar ao banco de dados
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');
    //sincronizar modelos (criar tabelas se não existirem)
    await sequelize.sync();
    console.log('✅ Modelos sincronizados');
    
    const csvFilePath = path.join(__dirname, 'pets.csv');
    
    //verificar se o arquivo CSV existe
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`Arquivo CSV não encontrado: ${csvFilePath}`);
    }
    
    const pets = [];
    let processedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;
    //ler arquivo CSV
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          // converter dados do CSV para o formato correto
          const petData = {
            id: row.id,
            name: row.name,
            species: row.species,
            breed: row.breed,
            age_years: parseInt(row.age_years),
            shelter_city: row.shelter_city,
            shelter_cep: row.shelter_cep,
            shelter_street: row.shelter_street,
            shelter_number: row.shelter_number,
            shelter_neighborhood: row.shelter_neighborhood,
            shelter_state: row.shelter_state,
            status: row.status || 'available'
          };
          pets.push(petData);
        })
        .on('end', async () => {
          try {
            console.log(`📄 Lidos ${pets.length} pets do arquivo CSV`);
            
            //processar cada pet com upsert idempotente
            for (const petData of pets) {
              try {
                const [pet, created] = await Pet.upsert(petData, {
                  returning: true
                });
                
                if (created) {
                  createdCount++;
                  console.log(`➕ Criado: ${petData.name} (${petData.id})`);
                } else {
                  updatedCount++;
                  console.log(`🔄 Atualizado: ${petData.name} (${petData.id})`);
                }
                
                processedCount++;
              } catch (error) {
                console.error(`❌ Erro ao processar pet ${petData.name}:`, error.message);
              }
            }
            
            console.log('\n📊 Resumo do Seed:');
            console.log(`   Total processados: ${processedCount}`);
            console.log(`   Novos criados: ${createdCount}`);
            console.log(`   Existentes atualizados: ${updatedCount}`);
            console.log('✅ Seed concluído com sucesso!');
            
            // Fechar conexão aqui, após processar todos os dados
            await sequelize.close();
            console.log('🔌 Conexão com banco fechada');
            
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message);
    // Fechar conexão em caso de erro
    await sequelize.close();
    console.log('🔌 Conexão com banco fechada');
    throw error;
  }
}

//executar seed se chamado diretamente
if (require.main === module) {
  seedPets()
    .then(() => {
      console.log('🎉 Processo de seed finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha no processo de seed:', error);
      process.exit(1);
    });
}

module.exports = seedPets;
