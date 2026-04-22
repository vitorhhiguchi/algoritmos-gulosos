def troco_guloso(valor, moedas):
    # Garante que as moedas estão ordenadas da maior para a menor
    moedas.sort(reverse=True) 
    resultado = []
    
    for moeda in moedas:
        while valor >= moeda:
            valor -= moeda
            resultado.append(moeda)
            
    return resultado

# Execução na apresentação
moedas_disponiveis = [100, 50, 25, 10, 5, 1]
troco = 87
print(f"Troco para {troco}:", troco_guloso(troco, moedas_disponiveis))