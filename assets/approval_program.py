from pyteal import *

def approval_program():
    var_1 = Int(1)

    on_deployment = Seq([
        App.globalPut(Bytes("singer"), Txn.sender()),
        Assert(Txn.application_args.length() == Int(0)),
        Return(var_1)
    ])

    @Subroutine(TealType.uint64)
    def verify_whitelist(signer, candidate, maxAmount, minAmount, signature):
        message = Concat(candidate, maxAmount, minAmount)
        messageHash = Keccak256(message)
        return Return(Ed25519Verify(messageHash, signature, signer))

    @Subroutine(TealType.uint64)
    def test_ecdsa():
        signer = App.globalGet(Bytes("singer"))
        candidate = Txn.application_args[1]
        maxAmount = Txn.application_args[2]
        minAmount = Txn.application_args[3]
        signature = Txn.application_args[4]

        verified = verify_whitelist(signer, candidate, maxAmount, minAmount, signature)
        return Seq([
            Assert(verified == Int(1)),
            # do something here
            Return(var_1)
        ])

    program = Cond(
        [Txn.application_id() == Int(0), on_deployment],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(var_1)], #block update
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(var_1)],
        [Txn.on_completion() == OnComplete.CloseOut, Return(var_1)],
        [Txn.on_completion() == OnComplete.OptIn, Return(var_1)],
        [Txn.application_args[0] == Bytes("test_ecdsa"), Return(test_ecdsa())],
        [Txn.application_args[0] == Bytes("nothing"), Return(var_1)]
    )

    return program


if __name__ == "__main__":
    print(compileTeal(approval_program(), Mode.Application, version = 5))
